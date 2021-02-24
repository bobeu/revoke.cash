import '../App.scss'
import { Signer, utils } from 'ethers'
import React, { useState } from 'react'
import { Button, Form, InputGroup, Modal } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { useFathom } from 'fathom-react'
import { getNativeToken, getDefaultAmount } from './util'

type Props = {
  signer: Signer,
  chainId: number,
}

const DonateButton: React.FC<Props> = ({ signer, chainId }) => {
  const fathom = useFathom()
  const nativeToken = getNativeToken(chainId)

  const [amount, setAmount] = useState<string>(getDefaultAmount(nativeToken))

  const [show, setShow] = useState<boolean>(false)
  const handleClose = () => setShow(false)
  const handleShow = () => {
    fathom.goal('DPYWAXTX', 0)
    setShow(true)
  }

  const sendDonation = async () => {
    if (!signer) {
      alert('Please connect your web3 wallet to donate')
    }

    try {
      await signer.sendTransaction({
        to: '0xe126b3E5d052f1F575828f61fEBA4f4f2603652a',
        from: await signer.getAddress(),
        value: utils.parseEther(amount),
      })

      toast.dark('Thanks for the donation!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })

      fathom.goal('QHSEVLIS', 0)

      setShow(false);
    } catch (err) {
      if (err.code && err.code === 'INVALID_ARGUMENT') {
        alert('Input is not a valid number')
      }

      console.log(err)
    }
  }

  return (
    <>
      <Button variant="outline-primary" onClick={handleShow}>Donate</Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Donate to Revoke.cash</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <InputGroup>
            <Form.Control
              value={amount}
              onChange={(event) => (setAmount(event.target.value))}
            />
            <InputGroup.Append>
              <InputGroup.Text>{nativeToken}</InputGroup.Text>
            </InputGroup.Append>
            <InputGroup.Append>
              <Button variant="secondary" onClick={sendDonation}>Send</Button>
            </InputGroup.Append>
          </InputGroup>
        </Modal.Body>

        <Modal.Footer>
          Or contribute to my <a href="https://gitcoin.co/grants/259/rosco-kalis-crypto-software-engineer">Gitcoin Grant</a>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default DonateButton
