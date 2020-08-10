import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios'

class API {
  constructor() {
    console.warn('API implement')

    this.opt = {
      url: 'http://localhost:5000',
      connected: false,
      apiChecked: false,
    }

    this.initConnection()
  }

  initConnection() {
    this.connection = axios.create({ baseURL: this.opt.url })
  }

  async getCurrentAPP() {
    return new Promise((res) => this.connection.get('/current').then(({ data }) => 
       res(data.app_name)
    ))
  }

  async getVolume() {
    return new Promise((res) => this.connection.get('volume').then(data => res(data.data.volume)))
  }


  async setVolume(arg, cb) {
    return new Promise((res) => this.connection.post('volume', { value: arg }).then(() => {
      cb()
    }))
  }
}


const LGApi = new API()

const LGControllerData = [
  { name: 'app', text: 'current APP name: ', APIFn: LGApi.getCurrentAPP.bind(LGApi) },
  { name: 'volume', text: 'current VOLUME:', APIFn: LGApi.getVolume.bind(LGApi) }
]



const updateServerInfo = ( dispatch ) => {
  let resolveObj = {}
  LGControllerData.forEach((current) => {
     current.APIFn().then((data) => {
       resolveObj = { ...resolveObj, [`${current.name}`]: data}
       dispatch({ ...resolveObj })
     })
  })
}

const VolumeControll = props => (
  <div>
    <button onClick={() => { props.changeVolume('up')}}>+</button>
    <button onClick={() => { props.changeVolume('down')}}>-</button>
  </div>
)

const LGController = props => {

  const [stateApp, setStateApp] = useState({ volume: 0 })
  useEffect(() => {
    updateServerInfo(setStateApp)
  }, [])


  const changeVolume = (dir) => {
    switch(dir) {
      case 'up':
        LGApi.setVolume(stateApp.volume + 1, () => updateServerInfo(setStateApp))
        break;

      case 'down':
        LGApi.setVolume(stateApp.volume - 1, () => updateServerInfo(setStateApp))
        break;

      default: 
        console.warn('heeere')
    }

  }
  return (
    <>
      {LGControllerData.map(({ text, name }) => 
        <p key={name}>{text}: {stateApp[`${name}`]}</p>
      )}

      <VolumeControll changeVolume={changeVolume} />
    </>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <LGController />
  </React.StrictMode>,
  document.getElementById('root')
);
