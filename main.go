package main

import (
	"os"

	"github.com/inconshreveable/log15"
)

var log = log15.New("component", "flynn-releases")

func main() {
	repo, err := NewRepository()
	if err != nil {
		log.Error("error creating repository", "err", err)
		os.Exit(1)
	}

	s := NewServer(repo)
	if err := s.ListenAndServe(); err != nil {
		log.Error("error serving HTTP requests", "err", err)
		os.Exit(1)
	}
}
