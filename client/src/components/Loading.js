import React from "react";

const Loading = () => {
    return (
        <div className="flex justify-center items-center h-screen w-screen">
            <div class="lds-facebook">
                <div></div><div></div><div></div>
                <div></div><div></div><div></div>
                <div></div>
            </div>
        </div>
    );
}

export default Loading;