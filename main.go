package main

import (
	"github.com/flynn/flynn/pkg/shutdown"
)

func main() {
	repo, err := NewRepository()
	if err != nil {
		shutdown.Fatal(err)
	}

	s := NewServer(repo)
	if err := s.ListenAndServe(); err != nil {
		shutdown.Fatal(err)
	}
}
