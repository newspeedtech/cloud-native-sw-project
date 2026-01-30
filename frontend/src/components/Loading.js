
export function Loading( {message = "Loading...", customStyle ={}}) {

    return (
        <div style = {customStyle}>
            <div className="spinner"></div>
            <p>{message}</p>
        </div>
    )
}