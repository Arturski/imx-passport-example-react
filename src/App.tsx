import { passport } from '@imtbl/sdk'
import { useEffect, useState } from 'react'
import { UserProfile } from '@imtbl/sdk/passport';
import { PassportButton } from './components/PassportButton';
import { parseJwt, passportProvider } from './utils/passport';
import './App.css'
import { ExternalWallets } from './components/ExternalWallets';
import { passportDashboardUrl } from './utils/config';

function App({passportInstance}: {passportInstance: passport.Passport}) {
  const [userInfo, setUserInfo] = useState<UserProfile>();
  const [walletAddress, setWalletAddress] = useState<string>();

  useEffect(() => {
    const login = async () => {
      const token = await passportInstance.getIdToken();
      const ppUserInfo = await passportInstance.getUserInfo();
      if(!token || !ppUserInfo) {
        console.log('user not logged in');
        console.log(token);
        console.log(ppUserInfo);
      } else {
        console.log('user is logged in... calling eth_requestAccounts');
        const [userAddress] = await passportProvider.request({ method: 'eth_requestAccounts' });
        console.log(userAddress);
        setUserInfo(ppUserInfo);
        setWalletAddress(userAddress);
      }
    }

    login();
    
  }, [passportInstance])

  async function login(){
    try{
      await passportProvider?.request({ method: 'eth_requestAccounts' });
    } catch(err) {
      console.log("Failed to login");
      console.error(err);
    }

    try{
      const userProfile = await passportInstance.getUserInfo();
      setUserInfo(userProfile)
    } catch(err) {
      console.log("Failed to fetch user info");
      console.error(err);
    }

    try{
      const idToken = await passportInstance.getIdToken();
      const parsedIdToken = parseJwt(idToken!);
      setWalletAddress(parsedIdToken.passport.zkevm_eth_address);
    } catch(err) {
      console.log("Failed to fetch idToken");
      console.error(err);
    }
  }

  async function idTokenClick() {
    const idToken = await passportInstance.getIdToken();
    window.open(`https://jwt.io?token=${idToken}`, "_blank")
  }

  async function accessTokenClick() {
    const accessToken = await passportInstance.getAccessToken();
    window.open(`https://jwt.io?token=${accessToken}`, "_blank")
  }

  function logout(){
    passportInstance.logout();
  }

  return (
    <div id="app">
      {!userInfo && <PassportButton title="Sign in with Immutable" onClick={login} />}
      {userInfo && (
        <>
        <div className='user-info'>
          <div className='user-info-row'>
            <p><strong>Passport info</strong></p>
            <a href={passportDashboardUrl} target='_blank'>Passport Dashboard</a>
            <PassportButton title="Logout" onClick={logout} />
          </div>
          <div className='user-info-row'><strong>Id:</strong><p>{userInfo.sub}</p></div>
          <div className='user-info-row'><strong>Email:</strong><p>{userInfo.email}</p></div>
          {walletAddress && <div className='user-info-row'><strong>Wallet:</strong><p>{walletAddress}</p></div>}
          <div className='user-info-row space'><button onClick={idTokenClick}>Inspect Id Token</button><button onClick={accessTokenClick}>Inspect Access Token</button></div>
          <hr className='divider' />
          <ExternalWallets />
        </div>
        <div className='docs-link-container'>
          <a href='https://docs.immutable.com/docs/zkEVM/products/passport' target='_blank'>Immutable zkEVM Docs</a>
          <a href='https://docs.immutable.com/docs/x/passport' target='_blank'>Immutable X Docs</a>
        </div>
        
        </>
      )}
    </div>
  )
}

export default App
