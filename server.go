package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"

	"github.com/julienschmidt/httprouter"
)

type Server struct {
	repo   *Repository
	router *httprouter.Router
}

func NewServer(repo *Repository) *Server {
	s := &Server{repo: repo, router: httprouter.New()}
	s.router.GET("/", s.Index)
	s.router.ServeFiles("/assets/*filepath", http.Dir("assets"))
	s.router.GET("/api/channels", s.GetChannels)
	s.router.GET("/api/channels/:name", s.GetChannel)
	return s
}

func (s *Server) ListenAndServe() error {
	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}
	addr := ":" + port
	log.Println("Listening on", addr)
	return http.ListenAndServe(addr, s.router)
}

func (s *Server) Index(w http.ResponseWriter, req *http.Request, _ httprouter.Params) {
	w.Header().Set("Content-Type", "text/html")
	http.ServeFile(w, req, "assets/index.html")
}

func (s *Server) GetChannels(w http.ResponseWriter, req *http.Request, _ httprouter.Params) {
	channels, err := s.repo.Channels()
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(channels)
}

func (s *Server) GetChannel(w http.ResponseWriter, req *http.Request, p httprouter.Params) {
	channel, err := s.repo.Channel(p.ByName("name"))
	if err != nil {
		if err == ErrChannelNotFound {
			http.NotFound(w, req)
			return
		}
		http.Error(w, err.Error(), 500)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(channel)
}
