import PropTypes from 'prop-types';
import { Card, Button } from 'react-bootstrap';

export default function WorkoutCard({ workoutProp, onDelete, onUpdate, onComplete }) {
    const { _id, name, duration, status } = workoutProp;

    return (
        <Card style={{ minWidth: '20rem', minHeight: '25rem' }} className='mb-2 text-center'>
            <Card.Body style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                <Card.Title className='text-center'>{name}</Card.Title>
                <p>Duration: {duration} minutes</p>
                <p>Status: {status}</p>
                <div className="d-flex justify-content-between">
                    <Button variant="warning" onClick={() => onUpdate(workoutProp)}>Update</Button>
                    <Button variant="success" onClick={() => onComplete(_id)}>Complete</Button>
                    <Button variant="danger" onClick={() => onDelete(_id)}>Delete</Button>
                </div>
            </Card.Body>
        </Card>
    );
}

WorkoutCard.propTypes = {
    workoutProp: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        duration: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
    }).isRequired,
    onDelete: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onComplete: PropTypes.func.isRequired, 
};
