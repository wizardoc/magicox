import React from 'react'
import { Switch, Route, injectAsyncData } from '@magicox/browser'
import { Hello } from './hello'
import { Component } from 'react'
import Axios from 'axios'

export class App extends Component {
  static preFetch() {
    return Axios.get('http://localhost:4000/organization/name/all').then(
      res => res.data
    )
  }

  render() {
    const { data } = this.props

    console.info(data)

    let organizeNames = []
    const renderOrganizeNames = data.organizeNames.map(({ OrganizeName }) => (
      <div>OrganizeName: {OrganizeName}</div>
    ))

    return <div>{renderOrganizeNames}</div>
  }

  componentDidMount() {
    console.info(this.props)
  }
}
