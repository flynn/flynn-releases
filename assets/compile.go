package main

import (
	"html/template"
	"log"
	"os"

	matrix "github.com/jvatic/asset-matrix-go"
)

func main() {
	m := matrix.New(&matrix.Config{
		Paths: []*matrix.AssetRoot{
			{Path: "src"},
			{Path: "vendor"},
			{
				GitRepo:   "git://github.com/jvatic/marbles-js.git",
				GitBranch: "master",
				GitRef:    "6057b0600550667e37e0e320e8bddc6563292139",
				Path:      "src",
			},
		},
		OutputDir:      "build",
		AssetURLPrefix: "/assets/",
	})
	if err := m.Build(); err != nil {
		log.Fatal(err)
	}
	if err := compileTemplate(m.Manifest); err != nil {
		log.Fatal(err)
	}
	m.RemoveOldAssets()
}

func compileTemplate(manifest *matrix.Manifest) error {
	type TemplateData struct {
		Development bool
	}
	tmpl, err := template.New("index.html.tmpl").Funcs(template.FuncMap{
		"assetPath": func(p string) string {
			return "/assets/" + manifest.Assets[p]
		},
	}).ParseFiles("src/index.html.tmpl")
	if err != nil {
		return err
	}
	file, err := os.Create("build/index.html")
	if err != nil {
		return err
	}
	defer file.Close()
	return tmpl.Execute(file, &TemplateData{
		Development: os.Getenv("ENVIRONMENT") == "development",
	})
}
