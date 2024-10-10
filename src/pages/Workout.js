import { Row, Button, Modal, Form, Col } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import WorkoutCard from '../components/workoutCard';
import { Notyf } from 'notyf'; 
import 'notyf/notyf.min.css'; 
import { Navigate, useNavigate } from 'react-router-dom'; 

export default function Products() {
    const notyf = new Notyf(); 
    const [workouts, setWorkouts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newWorkout, setNewWorkout] = useState({
        name: '',
        duration: '',
    });
    const [updateWorkout, setUpdateWorkout] = useState(null);
    const navigate = useNavigate(); 

    const fetchData = () => {
        fetch(`https://fitnessapp-api-ln8u.onrender.com/workouts/getMyWorkouts`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            setWorkouts(data.workouts);
        })
        .catch(err => {
            console.log("Error fetching workouts: ", err);
        });
    };

    const addWorkout = () => {
        fetch(`https://fitnessapp-api-ln8u.onrender.com/workouts/addWorkout`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newWorkout),
        })
        .then(res => res.json())
        .then(data => {
            console.log("Workout added:", data);
            notyf.success("Workout added successfully!"); 
            setShowModal(false); 
            fetchData(); 
            setNewWorkout({ name: '', duration: '' });
        })
        .catch(err => {
            console.log("Error adding workout: ", err);
            notyf.error("Failed to add workout."); 
        });
    };

    const deleteWorkout = (id) => {
        fetch(`https://fitnessapp-api-ln8u.onrender.com/workouts/deleteWorkout/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log("Workout deleted:", data);
            notyf.success("Workout deleted successfully!"); 
            fetchData(); 
        })
        .catch(err => {
            console.log("Error deleting workout: ", err);
            notyf.error("Failed to delete workout.");  
        });
    };

    const handleUpdateWorkout = (workout) => {
        setUpdateWorkout(workout);
        setNewWorkout({
            name: workout.name,
            duration: workout.duration,
            status: workout.status,
        });
        setShowModal(true);
    };

    const updateWorkoutApi = () => {
        fetch(`https://fitnessapp-api-ln8u.onrender.com/workouts/updateWorkout/${updateWorkout._id}`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newWorkout),
        })
        .then(res => res.json())
        .then(data => {
            console.log("Workout updated:", data);
            notyf.success("Workout updated successfully!"); 
            setShowModal(false); 
            fetchData(); 
            setNewWorkout({ name: '', duration: '' }); 
        })
        .catch(err => {
            console.log("Error updating workout: ", err);
            notyf.error("Failed to update workout."); 
        });
    };

    // New function to update workout status
    const completeWorkoutStatus = (id) => {
        fetch(`https://fitnessapp-api-ln8u.onrender.com/workouts/completeWorkoutStatus/${id}`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
        })
        .then(res => res.json())
        .then(data => {
            console.log("Workout status updated:", data);
            notyf.success("Workout status updated successfully!");
            fetchData(); // Refresh the workouts list after updating
        })
        .catch(err => {
            console.log("Error updating workout status: ", err);
            notyf.error("Failed to update workout status."); 
        });
    };

    // Logout function
    const handleLogout = () => {
        localStorage.removeItem('token'); 
        navigate('/login'); 
        notyf.success("Successfully logged out!"); 
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        localStorage.getItem('token')?
        <>
            <div className="d-flex justify-content-between p-3">
                <Button className='btn btn-danger' onClick={handleLogout}>
                    Logout
                </Button>
                <Button className='btn btn-success' onClick={() => setShowModal(true)}>
                    Add Workout
                </Button>
            </div>
            <Row className='justify-content-between'>
                {workouts ? (
                    workouts.map(workout => (
                        <WorkoutCard 
                            key={workout._id} 
                            workoutProp={workout} 
                            onDelete={deleteWorkout} 
                            onUpdate={handleUpdateWorkout} 
                            onComplete={completeWorkoutStatus} 
                        />
                    ))
                ) : (
                    <Col className='text-center mt-4'>
                        <h5>No workouts to display. Please add a workout.</h5>
                    </Col>
                )}
            </Row>

            {/* Modal for adding/updating a workout */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{updateWorkout ? "Update Workout" : "Add New Workout"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formWorkoutName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter workout name"
                                value={newWorkout.name}
                                onChange={e => setNewWorkout({ ...newWorkout, name: e.target.value })}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formWorkoutDuration">
                            <Form.Label>Duration (minutes)</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter duration"
                                value={newWorkout.duration}
                                onChange={e => setNewWorkout({ ...newWorkout, duration: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={updateWorkout ? updateWorkoutApi : addWorkout}>
                        {updateWorkout ? "Update Workout" : "Add Workout"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
        :
        navigate('/login')
    );
}
