{/* Background decorative elements */}
export default function Blubs(){
    return (
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-yellow-200 rounded-full opacity-10 -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-200 rounded-full opacity-10 translate-x-1/3 translate-y-1/3 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-green-200 rounded-full opacity-5 -translate-x-1/2 -translate-y-1/2 animate-bounce"></div>
      </div>
    )
}