import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ConfirmProvider, TooltipProvider } from '@/components/ui'
import { Shell } from './site/Shell'
import { ThemeProvider } from './site/theme'
import {
  BrandPage,
  ColorsPage,
  RadiusPage,
  ShadowsPage,
} from './site/pages/Foundations'
import { HomePage } from './site/pages/Home'
import {
  ButtonPage,
  CardPage,
  CheckboxPage,
  ColorPage,
  ComparePage,
  ConfirmPage,
  ContextMenuPage,
  DatePage,
  DialogPage,
  DrawerPage,
  FormPage,
  IconPage,
  InfoPage,
  InputPage,
  LayoutPage,
  MenuPage,
  NavigationMenuPage,
  NumberFlowPage,
  NumberPage,
  PaginationPage,
  PillPage,
  RadioCardsPage,
  SelectPage,
  SliderPage,
  SpinnerPage,
  SwitchPage,
  TabsPage,
  TextAreaPage,
  TogglePage,
  TooltipPage,
} from './site/pages/Primitives'
import {
  CaptionPage,
  FontsPage,
  HeadingsPage,
  TextPage,
} from './site/pages/Typography'

export function App() {
  return (
    <ThemeProvider>
      <TooltipProvider>
        <ConfirmProvider>
          <BrowserRouter>
            <Shell>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/brand" element={<BrandPage />} />
                <Route path="/colors" element={<ColorsPage />} />
                <Route path="/radius" element={<RadiusPage />} />
                <Route path="/shadows" element={<ShadowsPage />} />
                <Route path="/fonts" element={<FontsPage />} />
                <Route path="/heading" element={<HeadingsPage />} />
                <Route path="/text" element={<TextPage />} />
                <Route path="/caption" element={<CaptionPage />} />
                <Route path="/button" element={<ButtonPage />} />
                <Route path="/icon" element={<IconPage />} />
                <Route path="/spinner" element={<SpinnerPage />} />
                <Route path="/switch" element={<SwitchPage />} />
                <Route path="/toggle" element={<TogglePage />} />
                <Route path="/tabs" element={<TabsPage />} />
                <Route path="/tooltip" element={<TooltipPage />} />
                <Route path="/menu" element={<MenuPage />} />
                <Route
                  path="/navigation-menu"
                  element={<NavigationMenuPage />}
                />
                <Route path="/context-menu" element={<ContextMenuPage />} />
                <Route path="/dialog" element={<DialogPage />} />
                <Route path="/drawer" element={<DrawerPage />} />
                <Route path="/confirm" element={<ConfirmPage />} />
                <Route path="/card" element={<CardPage />} />
                <Route path="/input" element={<InputPage />} />
                <Route path="/textarea" element={<TextAreaPage />} />
                <Route path="/number-flow" element={<NumberFlowPage />} />
                <Route path="/number" element={<NumberPage />} />
                <Route path="/date" element={<DatePage />} />
                <Route path="/select" element={<SelectPage />} />
                <Route path="/slider" element={<SliderPage />} />
                <Route path="/checkbox" element={<CheckboxPage />} />
                <Route path="/color" element={<ColorPage />} />
                <Route path="/compare" element={<ComparePage />} />
                <Route path="/info" element={<InfoPage />} />
                <Route path="/pagination" element={<PaginationPage />} />
                <Route path="/pill" element={<PillPage />} />
                <Route path="/radio-cards" element={<RadioCardsPage />} />
                <Route path="/form" element={<FormPage />} />
                <Route path="/layout" element={<LayoutPage />} />
              </Routes>
            </Shell>
          </BrowserRouter>
        </ConfirmProvider>
      </TooltipProvider>
    </ThemeProvider>
  )
}
