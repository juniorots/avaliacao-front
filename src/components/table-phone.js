import React from "react";

const TablePhone = props => {
    let { items } = props;
    
    const removerItem = value => {
        let list = items;
        let i = list.indexOf(value);
        if (i !== -1 ) {
            list.slice(i, 1);
            items = list;
        }
    }

    return (
        <table style={styleTable}>
            <tbody>
            { items.map((telefone, index) => {
                return (
                    <tr key={index} style={styleLine}>
                        <td>{telefone.tipo}</td>
                        <td>{telefone.numero}</td>
                        {/* <td><button style={styleButton} 
                                onClick={()=>removerItem(telefone.numero)}>excluir
                            </button>
                        </td> */}
                    </tr>
                )
            })}
            </tbody>
        </table>
    );
};

const styleTable = {
    borderWidth: 10,
    borderColor: "red",
    color: "#0d6efd",
    marginBottom: 15,    
    padding: 10,
    flexDirection: "row",
    width: 280    
}

const styleLine = {
    paddingBottom: 15
}

const styleButton = {
    marginLeft: 3,
    backgroundColor: "#dfe2ed",
    color: "#4f62ab",
    borderWidth: 1,
    borderColor: "#1a40c9",
    fontSize: 13
}

export default TablePhone;