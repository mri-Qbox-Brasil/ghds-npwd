-- This file exists to catch the traditional qb-phone mail event triggered by third-party scripts.
-- Having this in Lua allows server owners who aren't familiar with TypeScript to easily modify
-- how their emails are bridged into NPWD.

RegisterNetEvent('qb-phone:server:sendNewMail', function(mailData)
    local src = source

    if src == '' or src == 0 or src == nil then
        TriggerEvent('npwd:mail:proxyNewMail', 0, mailData.citizenid or "", mailData.sender, mailData.subject, mailData.message, mailData.button)
    else
        TriggerEvent('npwd:mail:proxyNewMail', src, mailData.citizenid or "", mailData.sender, mailData.subject, mailData.message, mailData.button)
    end
end)

-- The npwd_qbx_mail explicitly supports an Offline mail trigger via citizenid
RegisterNetEvent('qb-phone:server:sendNewMailToOffline', function(citizenid, mailData)
    TriggerEvent('npwd:mail:proxyNewMail', 0, citizenid or "", mailData.sender, mailData.subject, mailData.message, mailData.button)
end)
