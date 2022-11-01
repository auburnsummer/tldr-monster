package main

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"

	"github.com/auburnsummer/glamour"
	"github.com/gomarkdown/markdown"
)

const DEFAULT_ERROR = "I could not find that page."
const THEME = "dracula"

func HTMLWrapper(innerHTML []byte) []byte {
	// we don't have to close the body or html tags, the browser can render it anyway.
	beginning := []byte(`<html><head><link rel="stylesheet" href="https://unpkg.com/sakura.css/css/sakura.css" type="text/css"></head><body>`)

	return append(beginning, innerHTML...)
}

// try to download a file. the channel will resolve with either the contents, or an empty byte slice.
func DownloadFileToChannel(url string, browser bool, out chan<- []byte) {
	empty := []byte{}
	resp, err := http.Get(url)
	if err != nil {
		out <- empty
		return
	}

	if resp.StatusCode != 200 {
		out <- empty
		return
	}

	content, err := io.ReadAll(resp.Body)
	if err != nil {
		out <- empty
		return
	}

	var outString []byte
	if browser {
		outString = HTMLWrapper(markdown.ToHTML(content, nil, nil))
	} else {
		outString2, err := glamour.RenderBytes(content, THEME)
		outString = outString2
		if err != nil {
			out <- empty
			return
		}
	}

	out <- outString
}

func IsABrowser(req *http.Request) bool {
	user_agents := req.Header.Values("user-agent")
	for _, value := range user_agents {
		if strings.Contains(strings.ToLower(value), "mozilla") {
			return true
		}
	}
	return false
}

func GetTldrPage(page string, browser bool) (out []byte) {
	// platforms we support with our service. this is in priority order,
	// so if a command exists in both "windows" and "linux", we would pick linux.
	platforms := [4]string{"common", "linux", "osx", "windows"}

	// corresponding URLs they must be hosted on if they exist.
	urls := platforms // this is a copy
	for i, plat := range platforms {
		urls[i] = fmt.Sprintf("https://raw.githubusercontent.com/tldr-pages/tldr/main/pages/%s/%s.md", plat, page)
	}

	var chans [4]chan []byte
	// corresponding channels we'll get the results back.
	for i := range platforms {
		newBox := make(chan []byte, 1)
		chans[i] = newBox
	}

	for i, plat := range platforms {
		url := fmt.Sprintf("https://raw.githubusercontent.com/tldr-pages/tldr/main/pages/%s/%s.md", plat, page)
		go DownloadFileToChannel(url, browser, chans[i])
	}

	for i := range platforms {
		result := <-chans[i]
		if len(result) > 0 {
			return result
		}
	}
	return []byte{}
}

func handler(w http.ResponseWriter, req *http.Request) {
	url := req.URL
	path := strings.TrimPrefix(url.Path, "/")

	var out []byte
	if len(path) == 0 {
		out = []byte(`
(\__/)      I'm a friendly TL;DR monster!
( '_')      Try something like:
(>   )>O         
U   U             curl tldr.monster/tar
`)
	} else {
		out = GetTldrPage(path, IsABrowser(req))
	}

	w.Header().Set("Cache-Control", "max-age=2592000")
	w.Write(out)
}

func main() {
	http.HandleFunc("/", handler)
	log.Println("Listing for requests at http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
