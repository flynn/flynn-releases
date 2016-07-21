package main

import (
	"encoding/json"
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
	s.router.ServeFiles("/assets/*filepath", http.Dir("assets/build"))
	s.router.GET("/api/channels", s.GetChannels)
	return s
}

func (s *Server) ListenAndServe() error {
	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}
	addr := ":" + port
	log.Info("listening for HTTP requests", "addr", addr)
	return http.ListenAndServe(addr, s.router)
}

func (s *Server) Index(w http.ResponseWriter, req *http.Request, _ httprouter.Params) {
	w.Header().Set("Content-Type", "text/html")
	http.ServeFile(w, req, "assets/build/index.html")
}

func (s *Server) GetChannels(w http.ResponseWriter, req *http.Request, _ httprouter.Params) {
	c := s.repo.Channels()
	w.Header().Set("Last-Modified", c.UpdatedAt.UTC().Format(http.TimeFormat))
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(c.Channels)
}
