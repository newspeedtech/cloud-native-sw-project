import NavBar from "./../components/NavBar";

export default function Home( {setAuthenticated} ) {
  return (
    <div>
      <NavBar />
      <div style={{textAlign: "center"}}>
        <h1>Hardware Checkout System</h1>
        <p>You are now logged in!</p>
      </div>
      <div className="image-button-container">
        <div class="image-button">
          <a href="/create-project">
            <img src="logo192.png"/>
          </a>
          <p> You can create a new project here </p>
        </div>
        
        <div class="image-button">
          <a href="/projects">
            <img src="logo192.png"/>
          </a>
          <p> View your existing projects here </p>
        </div>

        <div class="image-button">
          <a href="/resources">
            <img src="logo192.png"/>
          </a>
          <p> View your resources for projects here </p>
        </div>
      </div>
      
    </div>

  );
}
