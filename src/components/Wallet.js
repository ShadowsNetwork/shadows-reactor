import { useWeb3React, Web3ReactProvider } from '@web3-react/core';
import React, { useEffect, useState } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { useEagerConnect, useInactiveListener } from '@/web3/hooks';
import { injected } from '@/web3/connectors';
import { message, Modal } from 'antd';
import { formatEther } from '@ethersproject/units';
import { LoadingOutlined } from '@ant-design/icons';

function getLibrary(provider) {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

function Balance(props) {
  const { account, library, chainId } = props.context;

  const [balance, setBalance] = useState();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!!account && !!library) {
      let stale = false;

      setLoading(true);
      library
        .getBalance(account)
        .then((balance) => {
          setLoading(false);
          if (!stale) {
            setBalance(balance);
          }
        })
        .catch(() => {
          setLoading(false);
          if (!stale) {
            setBalance(null);
          }
        });

      return () => {
        stale = true;
        setBalance(undefined);
      };
    }
  }, [account, library, chainId]); // ensures refresh if referential identity of library doesn't change across chainIds

  return (
    <>
      <span role="img" aria-label="gold">
        💰
      </span>
      <span>Balance</span>
      <span>{loading && <LoadingOutlined />}</span>
      <span>{balance === null ? 'Error' : balance ? `Ξ${formatEther(balance)}` : ''}</span>
    </>
  );
}

function CurrentAccount(props) {
  const [isModalVisible, setModalVisible] = useState(false);

  const { account } = props.context;

  const openModal = () => {
    if (!props.context) {
      message.warning('无法获取钱包信息，请在 MetaMask 中重新链接');
    } else {
      setModalVisible(true);
    }
  };

  return (
    <>
      <span onClick={openModal}>{account}</span>
      <Modal
        title="Basic Modal"
        visible={isModalVisible}
        onOk={() => setModalVisible(false)}
        onCancel={() => setModalVisible(false)}
      >
        <Balance context={props.context} />
      </Modal>
    </>
  );
}

function ConnectToWallet() {
  const { activate } = useWeb3React();
  return (
    <span
      onClick={() => {
        activate(injected);
      }}
    >
      链接钱包
    </span>
  );
}

function WalletConsumer() {
  // const { connector, library, chainId, account, activate, deactivate, active, error } = context
  const context = useWeb3React();
  const { account } = context;

  const triedEager = useEagerConnect();

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager);

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      {!account && <ConnectToWallet />}
      {!!account && <CurrentAccount context={context} />}
    </Web3ReactProvider>
  );
}

function Wallet() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <WalletConsumer />
    </Web3ReactProvider>
  );
}

export default Wallet;
