# tldr.monster...

...is an online copy of [TL;DR Pages](https://github.com/tldr-pages/tldr) which is
designed for in-terminal use using `curl` or similar.

I've recently rewritten it in Go to avoid using Cloudflare Workers, so now you can use this guilt free!

To use it, run `curl tldr.monster/cmd`, replacing `cmd` with the command you want info on.

For instance, if I want info about `tar`, I would run `curl tldr.monster/tar`.

<p align="center">
  <img width="600" src="https://raw.githubusercontent.com/auburnsummer/tldr-monster/master/tldr.svg">
</p>

