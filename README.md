# the TL;DR monster...

...helps you remember how to use cli commands! Isn't the TL;DR monster nice?

tldr.monster is an online copy of [TL;DR Pages](https://github.com/tldr-pages/tldr) which is
designed for in-terminal use using `curl` or similar.

To use it, run `curl tldr.monster/cmd`, replacing `cmd` with the command you want info on.

For instance, if I want info about `tar`, I would run `curl tldr.monster/tar`.

<p align="center">
  <img width="600" src="https://raw.githubusercontent.com/auburnsummer/tldr-monster/master/tldr.svg">
</p>

# Bonus bash alias!

My assumption is that the main use for `tldr.monster` is in short-lived VMs where it's infeasible to
install a tldr client, but you still want to be able to access tldr pages. In a more
persistent environment you can just install a proper tldr client, right? Anyway, if you
_really_ want you can do this:

`tldr() { "curl" "tldr.monster/$1" }`

Paste this into a bash terminal, then you can just access it via `tldr cmd` (e.g. `tldr tar`).


# Not done yet

I will implement these later probably

 - handle ambigious cases (e.g. Linux `tree` vs Windows `tree`), right now it just assumes Linux because Linux is better^H^H^H^H^H^H^H^H^H^H^H^H^H^H^H Linux comes first in alphabetical order

 - language selection instead of just English