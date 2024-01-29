import { FC } from "react"
import { LoaderInterface } from "./Interfaces"


const Loader: FC<LoaderInterface> = ({ height, styles }) => {
    return (
      <div style={{"height": `${height}`}} 
           className={`${styles} flex items-center justify-center bg-white`}>
        <div className="custom-loader"></div>
      </div>
    )
  }
  
export default Loader