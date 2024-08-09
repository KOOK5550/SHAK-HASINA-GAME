import React from 'react'
import {connect} from 'react-redux'

import BirdImage from '../images/bird.png'

const Bird = ({y, r}) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: y,
        left: 80,
        width: 50,
        height: 50,
        background: `url(${BirdImage})`,
        transform: `rotate(${r}deg)`,
        transition: 'transform 100ms, top 300ms',
      }}>
    </div>
  )
}

const mapStateToProps = ({bird}) => ({y: bird.y, r: bird.r})
const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Bird)
