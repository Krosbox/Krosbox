# Krosbox

## How to use

- Clone or download this repo.
- Move *each file* (not the whole folders) from `client/` to your game folder, preserving the relative paths.
  - Replacing `mono.dll` is optional, but it is required if you want to be able to debug the client.
- Edit `serverdefault.xml` to configure your environment (mainly the IP address).
- Launch the game with `run.bat`. Alternatively, you can launch it from the command line if you need to redirect output or whatever, the key thing is to launch it with the `-S` option.

### Server

`cd server`  
`yarn start`

## Changelog

**(2019-01-07)** The first tutorial map is "playable".

**(2019-01-02)** Right now it doesn't do much, just the minimum required to bypass authentication and enter the home screen. Every other message type is still recognized and logged by the server (at least I think so) but not handled whatsoever.
