import { useSaleStore } from '@/stores';
import { Pagination } from '@mui/material'
import React, { useState } from 'react'
import usePagination from '../hooks/Pagination';
import { itemSearchInitialState } from '@/core/models';
import useFetchItems from '../hooks/useFetchItems.hook';

function ItemPagination() {
    const itemList = useSaleStore(state => state.collectionItems);
    const setItemSearch = useSaleStore(state => state.setItemSearch);

    const setCollectionItems = useSaleStore(state => state.setCollectionItems);
    const { fetchItem } = useFetchItems()
    const itemSearch = useSaleStore(state => state.itemSearch);

    const [page, setPage] = useState(1);
    const PER_PAGE = itemSearch.pageSize;
    const totalRecords = itemList.length > 0 ? itemList[0]?.totalRecords : 0
    const count = Math.ceil(totalRecords! / PER_PAGE);
    const _DATA = usePagination(itemList, PER_PAGE);

    const handleChange = (page: number) => {
        setPage(page);
        _DATA.jump(page);
        const paramsQuery = {
            ...itemSearchInitialState,
            ...itemSearch,  
            pageIndex: page
        }
        setItemSearch(paramsQuery) 

        fetchItem(paramsQuery).then(response => {
            setCollectionItems(response)
        })
    };

    return (
        <Pagination
            count={count}
            page={page}
            onChange={(_, page) => handleChange(page)}
            size='large'
            color="primary"
            showFirstButton
            showLastButton
            sx={{
                mt: 2,
                display: 'flex',
                justifyContent: 'center',
                '& .MuiPaginationItem-root': {
                    // fontSize: '1.2rem', // Increase font size for buttons
                    // color: 'blue',     // Change button color
                },
            }}
        />
    )
}

export default ItemPagination