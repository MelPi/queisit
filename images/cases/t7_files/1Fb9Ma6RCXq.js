if (self.CavalryLogger) { CavalryLogger.start_js(["3imyH"]); }

__d("MercuryRealTimeEnvironmentDropDown",["Arbiter","Bootloader","CurrentUser","MercurySyncDeltaHolder","MessengerMQTTGating"],(function(a,b,c,d,e,f){"use strict";var g={init:function(){b("Arbiter").subscribe("mqtt-websocket-connection-died",g.dropDownToChannel)},dropDownToChannel:function(){b("MessengerMQTTGating").turnOff();var a=b("MercurySyncDeltaHolder").getForFBID(b("CurrentUser").getAccountID()).getLastSeqID();b("Bootloader").loadModules(["ChannelManager"],function(c){c.startChannelManager(),c.subscribeIrisQueue(b("CurrentUser").getAccountID(),a?a.toString():"0"),b("Arbiter").inform("messenger-mqtt-drop-down-to-channel")},"MercuryRealTimeEnvironmentDropDown")}};e.exports=g}),null);