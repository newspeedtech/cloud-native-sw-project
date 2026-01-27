
export default function Home( ) {
  return (
    <div>
      <div style={{textAlign: "center"}}>
        <h1>Hardware Checkout System</h1>
        <p>You are now logged in!</p>
        <p>Welcome to the hardware checkout system. Please browse the tabs.</p>
      </div>
      <div style={{textAlign: "center"}}>
        <div className="image-button-container">
          
          <div class="image-button">
            <a href="/create-project">
              <img src="logo192.png" alt="create"/>
            </a>
            <p>You can create a new project</p>
          </div>
          
          <div class="image-button">
            <a href="/join-project">
              <img src="logo192.png" alt="join"/>
            </a>
            <p>You can join existing projects</p>
          </div>

          <div class="image-button">
            <a href="/projects">
              <img src="logo192.png" alt="projects"/>
            </a>
            <p>You can view your existing projects</p>
          </div>

          <div class="image-button">
            <a href="/resources">
              <img src="logo192.png"alt="resources"/>
            </a>
            <p>You can view resources for projects</p>
          </div>
      </div>
      </div>
      
    </div>

  );
}
