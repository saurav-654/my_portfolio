"use client"

import { Provider } from "react-redux"
import { store } from "./store/store"
import Portfolio from "./components/portfolio"

export default function Home() {
  return (
    <Provider store={store}>
      <Portfolio />
    </Provider>
  )
}
