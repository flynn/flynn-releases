package main

import (
	"encoding/json"
	"errors"
	"os"
	"sort"
	"strings"
	"sync"
	"time"

	"github.com/flynn/flynn/pkg/attempt"
	"github.com/flynn/flynn/pkg/shutdown"
	"github.com/flynn/flynn/pkg/tufutil"
	tuf "github.com/flynn/go-tuf/client"
	tufdata "github.com/flynn/go-tuf/data"
)

const (
	defaultTufRootKey    = `{"keytype":"ed25519","keyval":{"public":"6cfda23aa48f530aebd5b9c01030d06d02f25876b5508d681675270027af4731"}}`
	defaultTufRepository = "https://dl.flynn.io/tuf"
)

type Channel struct {
	Name    string     `json:"name"`
	Version string     `json:"version"`
	History []*History `json:"history"`
}

type History struct {
	Version   string `json:"version"`
	Changelog string `json:"changelog"`
}

type Repository struct {
	client *tuf.Client
	mtx    sync.RWMutex
}

func NewRepository() (*Repository, error) {
	rootKeyData := os.Getenv("TUF_ROOT_KEY")
	if rootKeyData == "" {
		rootKeyData = defaultTufRootKey
	}

	repository := os.Getenv("TUF_REPOSITORY")
	if repository == "" {
		repository = defaultTufRepository
	}

	rootKey := &tufdata.Key{}
	if err := json.Unmarshal([]byte(rootKeyData), rootKey); err != nil {
		return nil, err
	}

	localStore := tuf.MemoryLocalStore()
	remoteStore, err := tuf.HTTPRemoteStore(repository, nil)
	if err != nil {
		return nil, err
	}
	client := tuf.NewClient(localStore, remoteStore)

	if err := client.Init([]*tufdata.Key{rootKey}, 1); err != nil {
		return nil, err
	}

	if _, err := client.Update(); err != nil {
		return nil, err
	}

	r := &Repository{client: client}
	go r.updateLoop()
	return r, nil
}

var channelNames = []string{"stable", "nightly"}

func (r *Repository) Channels() ([]*Channel, error) {
	channels := make([]*Channel, len(channelNames))
	for i, name := range channelNames {
		channel, err := r.Channel(name)
		if err != nil {
			return nil, err
		}
		channels[i] = channel
	}
	return channels, nil
}

var ErrChannelNotFound = errors.New("channel not found")

func (r *Repository) Channel(name string) (*Channel, error) {
	r.mtx.RLock()
	defer r.mtx.RUnlock()

	version, err := tufutil.DownloadString(r.client, "/channels/"+name)
	if err != nil {
		if _, ok := err.(tuf.ErrUnknownTarget); ok {
			err = ErrChannelNotFound
		}
		return nil, err
	}
	version = strings.TrimSpace(version)

	targets, err := r.client.Targets()
	if err != nil {
		return nil, err
	}

	// use an initialised history slice to avoid encoding as "null"
	history := sortHistory{}
	for target := range targets {
		if !strings.HasPrefix(target, "/channel/"+name) || !strings.HasSuffix(target, "CHANGELOG.md") {
			continue
		}
		s := strings.SplitN(target, "/", 5)
		if len(s) != 5 {
			continue
		}
		changelog, err := tufutil.DownloadString(r.client, target)
		if err != nil {
			return nil, err
		}
		history = append(history, &History{
			Version:   s[3],
			Changelog: changelog,
		})
	}
	history.Sort()

	return &Channel{Name: name, Version: version, History: history}, nil
}

var updateAttempts = attempt.Strategy{
	Total: time.Minute,
	Delay: 5 * time.Second,
}

func (r *Repository) updateLoop() {
	interval := 5 * time.Minute

	for range time.Tick(interval) {
		if err := updateAttempts.Run(r.update); err != nil {
			shutdown.Fatal(err)
		}
	}
}

func (r *Repository) update() error {
	r.mtx.Lock()
	defer r.mtx.Unlock()
	_, err := r.client.Update()
	if tuf.IsLatestSnapshot(err) {
		err = nil
	}
	return err
}

// sortHistory sorts version history in reverse chronological order
type sortHistory []*History

func (s sortHistory) Len() int           { return len(s) }
func (s sortHistory) Less(i, j int) bool { return s[j].Version < s[i].Version }
func (s sortHistory) Swap(i, j int)      { s[i], s[j] = s[j], s[i] }
func (s sortHistory) Sort()              { sort.Sort(s) }
