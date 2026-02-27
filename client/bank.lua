QBX = exports.qbx_core

RegisterNUICallback('getBankCredentials', function(data, cb)
    src = source
    local player = QBX.PlayerData
    if player then
        local bankCredentials = {
            name = player.charinfo.firstname .. " " .. player.charinfo.lastname,
            balance = player.money.bank,
            id = player.citizenid,
            -- targetID = data.targetID
        }
        print('Bank Credentials:', json.encode(bankCredentials))
        cb(bankCredentials)
    else
        print('Erro: Player não encontrado')
        cb(nil)
    end
end)

-- RegisterNUICallback("getTransactionsFromClient", function(data, cb)
--     local transactions = lib.callback.await("ps-banking:server:getHistory", false)
-- print('GHDS CLIENTSIDE TRANSACTIONS', transactions)
--     local retData = {
--         id = transactions.id,
--         amount = transactions.amount,
--         targetName = transactions.targetName,
--         identifier = transactions.identifier,
--         date = transactions.date,
--         type = transactions.type
--     }
--     cb(retData)
-- end)

RegisterNUICallback("getTransactionsFromClient", function(data, cb)
    local transactions = lib.callback.await("ps-banking:server:getTransactionStats", false)
    print('GHDS CLIENTSIDE TRANSACTIONS', json.encode(transactions))

    local retData = {}
    for _, transaction in ipairs(transactions.transactionData) do
        table.insert(retData, {
            id = transaction.id,
            amount = transaction.amount,
            targetName = transaction.targetName,
            identifier = transaction.identifier,
            date = transaction.date,
            type = transaction.isIncome and "received" or "sent"
        })
    end
    
    cb(retData)
end)

RegisterNUICallback("transferMoneyFromClient", function(data, cb)
    local success, message = lib.callback.await("ps-banking:server:transferMoney", false, {
        id = data.id,
        amount = data.amount,
        method = data.method
    })

    if success then
        print("Transferência bem-sucedida: ", message)
        cb({ success = true, message = message })
    else
        print("Erro na transferência: ", message)
        cb({ success = false, message = message })
    end
end)


