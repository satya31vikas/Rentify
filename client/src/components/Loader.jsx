import {Grid} from 'react-loader-spinner'

const Loader = ()=>{
    return (
        <div className='z-10'>
            <Grid
                visible={true}
                height="110"
                width="110"
                color="#009EFF"
                ariaLabel="grid-loading"
                radius="12.5"
                wrapperStyle={{}}
                wrapperClass="grid-wrapper"
            />
        </div>
    )
}

export default Loader;