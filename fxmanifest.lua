fx_version "cerulean"
game "gta5"
description "MRI NPWD"

version "4.0.0"

credits({ "itschip", "erik-sn", "TasoOneAsia", "kidz", "RockySouthpaw", "SamShanks", "c-wide", "mojito", "ghds", "mur4i" })

client_scripts({
	"client/client.js",
	"client/*.lua",
	"@qbx_core/modules/playerdata.lua"
})

shared_scripts{
	'@ox_lib/init.lua',
}

server_script({
	-- This is a file that lives purely in source code and isn't compiled alongside
	-- rest of the release. It's used to detect whether a user can read or not.
	"server/server.js",
	"server/*.lua"
})

ui_page("html/index.html")

files({
	"config.json",
	"html/index.html",
	"html/**/*",
})

dependency({
	"screenshot-basic",
	"pma-voice",
})

lua54 "yes"