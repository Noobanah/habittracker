export default function ModalAlert({onClose}) {
    return (
        <div className='modal-overlay'>
            <div className='modal-content'>
                <h1>You already have this category</h1>
                <button onClick={onClose}>X</button>
            </div>
        </div>
        
    )
}