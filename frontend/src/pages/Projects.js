import { useEffect, useState } from 'react';

export default function Projects({ setAuthenticated }) {
    const [projects, setProjects] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        getProjects();
    }, []);

    const getProjects = async (e) => {

        const token = localStorage.getItem("access_token");
        if (!token) {
            setMessage("You must be signed in to view projects.");
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });

            if (res.ok) {
                const data = await res.json();
                setProjects(data);
            } else {
                setMessage('Failed to load projects');
            }
        } catch (err) {
            console.error(err);
            setMessage("Network error - can't load projects");
        }
    };

    return (
        <div>
            <div style={{ textAlign: "center" }}>
                <h1>Projects Page</h1>
                <p>Below are all of your projects</p>
                <table class="project-table">
                    <thead>
                        <tr>
                            <th>Project ID</th>
                            <th>Project Name</th>
                            <th>Description</th>
                            <th>Owner</th>
                            <th>Users</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center' }}>
                                    No projects found
                                </td>
                            </tr>
                        ) : (
                            projects.map((project) => (
                                <tr key={project.projectid}>
                                    <td>{project.projectid}</td>
                                    <td>{project.projectname}</td>
                                    <td>{project.description}</td>
                                    <td>{project.owner}</td>
                                    <td>
                                        {Array.isArray(project.users) ? (
                                            project.users.map((user, index) => (
                                                <div key={index}>{user}</div>
                                            ))
                                        ) : (
                                            project.users
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                {message && <p>{message}</p>}
            </div>
        </div>
    );
}
