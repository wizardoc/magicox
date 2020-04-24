import React, { Component, ReactNode, ComponentType } from 'react'

export function injectAsyncData() {
  return (Wrapper: ComponentType): any => {
    return class extends Component {
      render(): ReactNode {
        let injectProps = {}

        if (typeof window !== 'undefined') {
          injectProps = window.__INIT_DATA__
        }

        return <Wrapper {...this.props} {...injectProps}></Wrapper>
      }
    }
  }
}
