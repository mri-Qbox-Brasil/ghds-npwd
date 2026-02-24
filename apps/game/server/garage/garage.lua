local QBX = exports.qbx_core

-- Callback de servidor para buscar veículos
lib.callback.register('npwd:server:getGarageVehicles', function(source)
    local player = QBX:GetPlayer(source)
    if not player then return {} end

    local citizenid = player.PlayerData.citizenid
    local p = promise.new()

    exports.oxmysql:execute('SELECT * FROM player_vehicles WHERE citizenid = ?', {citizenid}, function(vehicles)
        if vehicles then
            local allVehicles = GetAllVehicles()
            local plateToEntity = {}
            for i=1, #allVehicles do
                local veh = allVehicles[i]
                local plate = GetVehicleNumberPlateText(veh):gsub("%s+", "")
                plateToEntity[plate] = veh
            end

            for _, v in ipairs(vehicles) do
                local plate = v.plate:gsub("%s+", "")
                local entity = plateToEntity[plate]
                if entity then
                    local coords = GetEntityCoords(entity)
                    v.coords = {x = coords.x, y = coords.y, z = coords.z}
                end
            end
        end
        p:resolve(vehicles or {})
    end)

    return Citizen.Await(p)
end)

-- Callback para buscar localização exata de um veículo
lib.callback.register('npwd:server:getVehicleLocation', function(source, plate)
    local allVehicles = GetAllVehicles()
    local trimmedPlate = plate:gsub("%s+", "")
    for i=1, #allVehicles do
        local veh = allVehicles[i]
        if GetVehicleNumberPlateText(veh):gsub("%s+", "") == trimmedPlate then
            local coords = GetEntityCoords(veh)
            return {x = coords.x, y = coords.y, z = coords.z}
        end
    end
    return nil
end)

-- Callback de servidor para validar e iniciar manobrista
lib.callback.register('npwd:server:callValet', function(source, data)
    local player = QBX:GetPlayer(source)
    if not player then return {success = false} end

    local plate = data.plate
    local model = data.model
    local p = promise.new()

    exports.oxmysql:execute('SELECT state, garage FROM player_vehicles WHERE plate = ?', {plate}, function(result)
        if result and result[1] then
            local state = result[1].state
            -- Permite manobrista se estiver na garagem (1) ou fora/no depot (0)
            if state == 2 then
                p:resolve({success = false, message = 'Seu veículo está apreendido!'})
            else
                -- Cobrança de taxa
                local config = json.decode(LoadResourceFile(GetCurrentResourceName(), 'config.json'))
                local basePrice = (config and config.garage and config.garage.valetPrice) or 500
                local price = state == 0 and (basePrice * 2) or basePrice

                if player.Functions.RemoveMoney('bank', price, 'Valet Fee') then
                    -- Inicia o processo no cliente
                    TriggerClientEvent('npwd:client:startValet', source, plate, model)
                    p:resolve({success = true})
                else
                    p:resolve({success = false, message = 'Dinheiro insuficiente no banco! Taxa: $' .. price})
                end
            end
        else
            p:resolve({success = false, message = 'Veículo não encontrado.'})
        end
    end)

    return Citizen.Await(p)
end)

RegisterNetEvent('npwd:server:updateVehicleState', function(plate, state)
    exports.oxmysql:execute('UPDATE player_vehicles SET state = ? WHERE plate = ?', {state, plate})
end)

-- Evento para dar chaves via mri_Qcarkeys
RegisterNetEvent('npwd:server:giveVehicleKeys', function(plate)
    local src = source
    if exports['mri_Qcarkeys'] then
        exports['mri_Qcarkeys']:GiveTempKeys(src, plate)
    end
end)
