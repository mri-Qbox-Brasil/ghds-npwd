local QBX = exports.qbx_core

-- Callback de servidor para buscar veículos
lib.callback.register('npwd:server:getGarageVehicles', function(source)
    local player = QBX:GetPlayer(source)
    if not player then return {} end

    local citizenid = player.PlayerData.citizenid
    local p = promise.new()

    -- Usando 'execute' ou 'query' com callback para evitar query_await
    exports.oxmysql:execute('SELECT * FROM player_vehicles WHERE citizenid = ?', {citizenid}, function(vehicles)
        p:resolve(vehicles or {})
    end)

    return Citizen.Await(p)
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
            if result[1].state ~= 1 then
                p:resolve({success = false, message = 'Seu veículo não está na garagem!'})
            else
                -- Inicia o processo no cliente
                TriggerClientEvent('npwd:client:startValet', source, plate, model)
                p:resolve({success = true})
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
