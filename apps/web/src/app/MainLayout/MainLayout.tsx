import { ReactNode } from "react";
import Footer from "./Footer/Footer";
import Header from "./Header/Header";

interface Props {
  children: ReactNode;
}

const MainLayout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}

export default MainLayout;
