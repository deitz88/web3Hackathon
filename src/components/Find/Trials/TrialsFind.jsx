import React, { useState, useEffect } from 'react'
import './TrialsFind.css'
import { Form, Grid, Loader } from 'semantic-ui-react'
import trialsService from '../../../utils/trialsService'


export default function TrialsFind(props) {

    const [loading, setLoading] = useState(false)
    const [show, setShow] = useState(true)
    const [formInput, setFormInput] = useState({
        trial: ''
    })
    const [clients, setClients] = useState()

    const handleSelect = (e, { value }) => setFormInput({ ...formInput, ['trial']: value });

    function toggle(e) {
        e.preventDefault()
        setShow(true)
    }

    function percentByTrial(client) {
        let trials = client.trials
        for (let i = 0; i < trials.length; i++) {
            if (trials[i].trialIdentification === formInput.trial) {
                return trials[i].percentageCompleted
            } else {
                console.log(false)
            }
        }
    }

    async function selectHandler(e) {
        e.preventDefault()
        setLoading(true)
        const data = await trialsService.findClients(formInput.trial)
        setClients(data.clients)
        setShow(false)
        setLoading(false)

    }
    if (loading) {
        return (
            <Grid
                textAlign="center"
                style={{ height: "50vh" }, { margin: '10em' }}
                verticalAlign="middle"
            >
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Loader size="large" active>
                        Loading
                    </Loader>
                </Grid.Column>
            </Grid>
        );
    } else {

        if (show == true) {
            return (

                <Form>
                    <label>Find clients of trial</label>
                    <br /><br />
                    <Form.Select
                        placeholder='Select Associated Trial'
                        id='TrialFindSelect'
                        options={
                            props.trials.map(trial => {
                                return {
                                    key: trial.name,
                                    value: trial._id,
                                    text: trial.name
                                }
                            })
                        }
                        onChange={handleSelect}
                        required
                    /> <Form.Button id='TrialFindButtonForm' size='mini' onClick={selectHandler}>Search</Form.Button>
                </Form>

            )
        } else if (!show) {
            return (
                <>
                    {clients.map((client, i) => {
                        return (

                            <h6 key={i}>{client.walletAddress} + {percentByTrial(client)}</h6>
                        )
                    })}

                    <button style={{ marginRight: '2em' }} onClick={toggle}>Select Another Trial</button>
                    <button>Send Money</button>
                </>
            )
        }

    }
}
