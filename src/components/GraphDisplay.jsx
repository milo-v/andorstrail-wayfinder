import React, { useEffect, useState } from "react";

const GraphDisplay = () => {
    const [data, setData] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
            const response = await fetch('graph.json')
            if (!response.ok) {
                throw new Error('Error getting graph data')
            }
            const json = await response.json()
            setData(json)} catch (error) {
                setError(error.message)
            }
        }

        fetchData()
    }, [])

    const prettyPrintJson = (json) => {
        return JSON.stringify(json, null, 2)
    }

    if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
      {prettyPrintJson(data)}
    </pre>
  );
}

export default GraphDisplay