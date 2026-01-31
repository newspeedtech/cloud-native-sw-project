import { Container, Row, Col, Card } from "react-bootstrap";
import { FolderPlus, PersonPlusFill, Folder2Open, CpuFill } from "react-bootstrap-icons";

export default function Home() {
  const accentColor = "#3b82f6";
  
  const cards = [
    {
      href: "/create-project",
      title: "Create Project",
      description: "Start a new project and invite collaborators",
      icon: FolderPlus
    },
    {
      href: "/join-project",
      title: "Join Project",
      description: "Join an existing project using a slug",
      icon: PersonPlusFill
    },
    {
      href: "/projects",
      title: "My Projects",
      description: "View and manage your existing projects",
      icon: Folder2Open
    },
    {
      href: "/resources",
      title: "Resources",
      description: "Browse available hardware resources",
      icon: CpuFill
    }
  ];

  return (
    <div className="d-flex flex-column" style={{ minHeight: 'calc(100vh - 70px)' }}>
      <Container className="py-5 flex-grow-1 d-flex flex-column justify-content-center">
        {/* Header Section */}
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold mb-3" style={{ color: '#1f2937' }}>
            Hardware Checkout System
          </h1>
          <p className="lead text-muted mx-auto" style={{ maxWidth: '500px' }}>
            Manage your hardware resources efficiently. Create projects, collaborate with your team, and track equipment.
          </p>
        </div>
        
        {/* Cards Section */}
        <Row className="g-4 justify-content-center">
          {cards.map((card, index) => (
            <Col key={index} xs={12} sm={6} lg={3}>
              <a href={card.href} style={{ textDecoration: 'none' }}>
                <Card 
                  className="h-100 text-center border-0 shadow-sm"
                  style={{ 
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    borderRadius: '12px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '';
                  }}
                >
                  <Card.Body className="d-flex flex-column p-4">
                    <div 
                      className="mb-3 mx-auto d-flex align-items-center justify-content-center rounded-circle"
                      style={{ 
                        width: '72px', 
                        height: '72px', 
                        backgroundColor: `${accentColor}10`
                      }}
                    >
                      <card.icon size={32} color={accentColor} />
                    </div>
                    <Card.Title className="fw-semibold mb-2" style={{ color: '#1f2937', fontSize: '1.1rem' }}>
                      {card.title}
                    </Card.Title>
                    <Card.Text className="text-muted" style={{ fontSize: '0.9rem' }}>
                      {card.description}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </a>
            </Col>
          ))}
        </Row>
      </Container>
      
      {/* Footer */}
      <footer className="text-center py-3 text-muted" style={{ fontSize: '0.85rem' }}>
        <Container>
          Hardware Checkout System &copy; {new Date().getFullYear()}
        </Container>
      </footer>
    </div>
  );
}
