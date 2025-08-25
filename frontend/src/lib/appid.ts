import AppID from "ibmcloud-appid-js";

let appID: AppID | null = null;

export async function initAppID(){
  if (appID) return appID;
  appID = new AppID();
  await appID.init({
    clientId: import.meta.env.VITE_APPID_CLIENT_ID,
    discoveryEndpoint: import.meta.env.VITE_APPID_DISCOVERY
  });
  return appID;
}
