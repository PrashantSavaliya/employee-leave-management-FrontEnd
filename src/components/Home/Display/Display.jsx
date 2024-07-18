import React from 'react'

const Display = () => {
    return (
        <div
            className="sign-in__wrapper"
            style={{
                backgroundImage: `url('https://images.pexels.com/photos/604684/pexels-photo-604684.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')`,
                height: "100vh",
                width: '100%'
            }}
        >
            <div className="sign-in__backdrop text-white text-center h2 p-4">
                <div className="max-w-md mx-auto border border-gray-60 rounded-lg p-5 bg-blur">Your leave request has been sent to the admin !!</div>
            </div>
        </div>
    )
}

export default Display
