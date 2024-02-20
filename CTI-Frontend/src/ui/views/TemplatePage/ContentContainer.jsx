const ContentContainer = ({children})=> {
    return (
        <div  className="main-content-container" style={{height: "100%"}}>
            {children}
        </div>
    )
}

export default ContentContainer;