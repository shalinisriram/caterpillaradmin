
//const DefaultURL: any = 'http://localhost:5000';
  // const DefaultURL: any = 'https://localhost:5000';
  // const DefaultURL: any = 'https://caterpillarwebapi.azurewebsites.net';
  const DefaultURL: any = 'https://catweapi.azurewebsites.net';
export const environment = {
  // DeafultUrl : 'https://newcaterpillarwebapi.azurewebsites.net',
  authUrl: 'https://localhost:5000/api/Auth',//https://newcaterpillarwebapi.azurewebsites.net/api/Auth
  apiURL:  DefaultURL +'/api/Auth/api/',
  adminURL:  DefaultURL +'/api/Admin',
  ecmURL:  DefaultURL +'/api/ECM',
  adminecmURL: DefaultURL + '/api/AdminECM',
  unitUrl: DefaultURL + '/api/',
  uploadUrl:  DefaultURL +'/api/admin/',
  archiveUrl: DefaultURL + '/api/Archive/',
  filetransferUrl:  DefaultURL +'/api/FileTransfer/',
  QualityUrl:  DefaultURL +'/api/Quality/',
  WorkInstructionInputOptionUrl :DefaultURL+'/api/WorkInstructionInputOption/',
  licence: "CH200771842",
  production: true
};

