import React from 'react';
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';

const Pagination = ({ postsPerPage, totalPosts, paginate, sections }) => {
    const pageNumbers = [];
    for(let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
        pageNumbers.push(i);
    }
    return (
        <div >
           <ul className="pagination">
                {pageNumbers.map(number => (
                    <li className="item" style={{padding: 2}} key={number}>
                        <button style={{borderColor: 'transparent', borderRadius: 7, backgroundcolor: 'yellow', fontFamily: 'Montserrat'}} onClick={() => paginate(number)}>
                            {number}
                        </button>
                    </li>
                ))}   
            </ul> 
        </div>
    )
}

export default Pagination