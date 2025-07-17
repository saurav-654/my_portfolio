import { configureStore, createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface ScrollState {
  activeSection: string
  scrollY: number
  isScrolling: boolean
}

const initialState: ScrollState = {
  activeSection: "home",
  scrollY: 0,
  isScrolling: false,
}

const scrollSlice = createSlice({
  name: "scroll",
  initialState,
  reducers: {
    setActiveSection: (state, action: PayloadAction<string>) => {
      state.activeSection = action.payload
    },
    setScrollY: (state, action: PayloadAction<number>) => {
      state.scrollY = action.payload
    },
    setIsScrolling: (state, action: PayloadAction<boolean>) => {
      state.isScrolling = action.payload
    },
  },
})

export const { setActiveSection, setScrollY, setIsScrolling } = scrollSlice.actions

export const store = configureStore({
  reducer: {
    scroll: scrollSlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
