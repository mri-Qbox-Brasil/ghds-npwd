local QBX = exports.qbx_core

-- NUI: Buscar veículos (vêm do servidor)
RegisterNUICallback('getGarageVehicles', function(_, cb)
    local vehicles = lib.callback.await('npwd:server:getGarageVehicles', false)
    cb(vehicles)
end)

-- NUI: Rastrear veículo
RegisterNUICallback('trackVehicle', function(data, cb)
    local plate = data.plate
    local state = data.state
    local garage = data.garage

    if state == 1 then
        exports.ox_lib:notify({
            title = 'Rastreamento',
            description = 'O veículo está na garagem: ' .. (garage or 'Desconhecida'),
            type = 'info'
        })
    else
        local vehicles = GetGamePool('CVehicle')
        local found = false
        for _, veh in ipairs(vehicles) do
            if qbx.getVehiclePlate(veh) == plate then
                local coords = GetEntityCoords(veh)
                SetNewWaypoint(coords.x, coords.y)
                exports.ox_lib:notify({
                    title = 'Rastreamento',
                    description = 'Localização do veículo marcada no GPS!',
                    type = 'success'
                })
                found = true
                break
            end
        end

        if not found then
            exports.ox_lib:notify({
                title = 'Rastreamento',
                description = 'Não foi possível localizar o veículo no GPS.',
                type = 'error'
            })
        end
    end
    cb('ok')
end)

-- NUI: Chamar manobrista
RegisterNUICallback('callValet', function(data, cb)
    local response = lib.callback.await('npwd:server:callValet', false, data)
    if not response.success and response.message then
        exports.ox_lib:notify({
            title = 'Garagem',
            description = response.message,
            type = 'error'
        })
    end
    cb(response)
end)

-- Processo do Manobrista (NPC dirigindo)
RegisterNetEvent('npwd:client:startValet', function(plate, model)
    local playerPed = PlayerPedId()
    local playerCoords = GetEntityCoords(playerPed)
    
    exports.ox_lib:notify({
        title = 'Manobrista',
        description = 'O manobrista está trazendo seu veículo...',
        type = 'info'
    })

    -- Procura ponto de spawn
    local retval, outCoords, outHeading = GetClosestVehicleNodeWithHeading(playerCoords.x + 40, playerCoords.y + 40, playerCoords.z, 1, 3, 0)
    
    if not retval then
        outCoords = playerCoords + vector3(25.0, 25.0, 0.0)
        outHeading = 0.0
    end

    lib.requestModel(model)

    local vehicle = CreateVehicle(model, outCoords.x, outCoords.y, outCoords.z, outHeading, true, false)
    SetVehicleNumberPlateText(vehicle, plate)
    SetEntityAsMissionEntity(vehicle, true, true)
    
    local pedModel = `s_m_m_gentransport`
    lib.requestModel(pedModel)
    
    local valetPed = CreatePedInsideVehicle(vehicle, 26, pedModel, -1, true, false)
    SetBlockingOfNonTemporaryEvents(valetPed, true)
    SetEntityInvincible(valetPed, true)
    
    -- Dirige até o jogador
    TaskVehicleDriveToCoord(valetPed, vehicle, playerCoords.x, playerCoords.y, playerCoords.z, 15.0, 0, GetEntityModel(vehicle), 786603, 5.0, true)
    
    local arrived = false
    local timeout = 0
    while not arrived and timeout < 60 do
        Wait(500)
        timeout = timeout + 1
        local dist = #(GetEntityCoords(vehicle) - playerCoords)
        if dist < 8.0 then
            arrived = true
        end
    end
    
    TaskVehicleTempAction(valetPed, vehicle, 27, 5000)
    Wait(2000)
    TaskLeaveVehicle(valetPed, vehicle, 0)
    Wait(2000)
    TaskWanderStandard(valetPed, 10.0, 10)
    
    SetTimeout(20000, function()
        if DoesEntityExist(valetPed) then
            DeletePed(valetPed)
        end
    end)
    
    exports.ox_lib:notify({
        title = 'Manobrista',
        description = 'Seu veículo foi entregue!',
        type = 'success'
    })

    TriggerServerEvent('npwd:server:updateVehicleState', plate, 0)
end)
