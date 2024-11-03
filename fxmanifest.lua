fx_version("cerulean")
game("gta5")
description("js runtime monkaW")
authors({ "itschip", "erik-sn", "TasoOneAsia", "kidz", "RockySouthpaw", "SamShanks", "c-wide", "mojito", "ghds" })
version("3.15.1-beta.2")

client_scripts({
	"dist/game/client/client.js",
	"dist/game/client/*.lua",
	"@qbx_core/modules/playerdata.lua"
})

shared_scripts{
	'@ox_lib/init.lua',
}

server_script({
	-- This is a file that lives purely in source code and isn't compiled alongside
	-- rest of the release. It's used to detect whether a user can read or not.
	"dist/game/server/server.js",
})

ui_page("dist/html/index.html")

files({
	"config.json",
	"dist/html/index.html",
	"dist/html/**/*",
})

dependency({
	"screenshot-basic",
	"pma-voice",
})

lua54 "yes"