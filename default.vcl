vcl 4.1;

sub vcl_hash {
    if (req.http.User-Agent ~ "mozilla") {
        hash_data("desktop");
    }
    // no return, so the builtin VCL will take care of adding the URL, Host: or server IP# to the hash as usual.
}

backend default {
    .host = "127.0.0.1";
    .port = "8080";
}
