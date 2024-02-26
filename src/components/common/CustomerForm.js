import React, { useEffect, useState } from 'react'
import axios from 'axios'
import '../../styles/customer-form.css'
import moment from 'moment/moment';
import { isEmptyOrNil } from '../../common';
import { generateRandomNumber } from '../../store/common/function';
// import SelectionList from './SelectionList';
// import { animals } from '../../data/index'

export const EnumTypeGender = {
    male: 'Anh',
    female: 'Chị',
}

const CustomerForm = ({ cardToCheckOut, productTotalQuantityInState, productTotalPriceInState, handleOrder }) => {

    /* #region  state */
    const [name, setNameChange] = useState('')
    // const [email, setEmailChange] = useState('')
    const [phone, setPhoneChange] = useState('')
    // const [active, setActiveChange] = useState(true)
    const [gender, setGender] = useState(EnumTypeGender.male);
    const [validation, setValidationChange] = useState(false)
    const [provinceList, setProvinceList] = useState([])
    const [districtList, setDistrictList] = useState([])
    const [wardList, setWardList] = useState([])
    const [provinceid, setProvinceid] = useState('');
    const [districtid, setDistrictId] = useState('');
    const [wardid, setWardId] = useState('');
    const [selectProvince, setSelectProvince] = useState('');
    const [selectDistrict, setSelectDistrict] = useState('');
    const [address, setAddress] = useState('');
    const getTimeNow = moment(new Date()).format('DD/MM/YYYY, h:mm:ss a')
    /* #endregion */

    /* #region: Province */
    useEffect(() => {
        const fetchDataProvinces = async () => {
            return await new Promise((resolve, reject) => {
                const data = axios.get(`https://vapi.vnappmob.com/api/province/`)
                    .then((response) => {
                        try {
                            if (data) {
                                console.log('provinceList', response.data.results);
                                setProvinceList(response.data.results)
                                resolve(response)
                            } else {
                                console.log('Cannot get data');
                                reject()
                            }
                        } catch (error) {
                            reject(error)
                        }
                    })
            })
        }
        fetchDataProvinces()
    }, []);

    const handlecountry = (e) => {
        const getcountryid = e.target.value;
        setSelectProvince(e.target.value)
        setProvinceid(getcountryid);
    }
    /* #endregion */

    /* #region: District */
    useEffect(() => {
        const fetchDataDistrict = async () => {
            if (provinceid) {
                return await new Promise((resolve, reject) => {
                    axios.get(`https://vapi.vnappmob.com/api/province/district/${provinceid}`)
                        .then((response) => {
                            try {
                                if (response) {
                                    // console.log('resProvinces', response.data.results);
                                    let data = response.data.results
                                    const dataDistrict = data.filter((i) => i.province_id === provinceid)
                                    console.log('dataDistrict', dataDistrict);
                                    setDistrictList(dataDistrict)
                                    resolve(response)
                                } else {
                                    console.log('Cannot get data');
                                    reject()
                                }
                            } catch (error) {
                                reject(error)
                            }
                        })
                })
            }
        }
        fetchDataDistrict()
    }, [provinceid])

    const handleDistrict = (e) => {
        const getstateid = e.target.value;
        setSelectDistrict(e.target.value)
        setDistrictId(getstateid);
    }
    /* #endregion */

    /* #region: Ward */
    useEffect(() => {
        const fetchDataWard = async () => {
            if (districtid) {
                return await new Promise((resolve, reject) => {
                    const data = axios.get(`https://vapi.vnappmob.com/api/province/ward/${districtid}`)
                        .then((response) => {
                            try {
                                if (data) {
                                    let data = response.data.results
                                    const dataWard = data.filter((i) => i.district_id === districtid);
                                    console.log('dataWard', dataWard);
                                    setWardList(dataWard)
                                    resolve(response)
                                } else {
                                    console.log('Cannot get data');
                                    reject()
                                }
                            } catch (error) {
                                reject(error)
                            }
                        })
                })
            }
        }
        fetchDataWard()
    }, [districtid])

    const handleWard = (e) => {
        const getstateid = e.target.value;
        setWardId(getstateid);
    }

    /* #endregion */

    /* #region  handleSubmit checkout */
    const handleSubmit = (e) => {
        e.preventDefault()
        const filterProvince = provinceList.filter((i) => i.province_id === selectProvince)
        const nameProvice = Object.assign({}, ...filterProvince)

        const filterDistrict = districtList.filter((i) => i.district_id === selectDistrict)
        const nameDistrict = Object.assign({}, ...filterDistrict)

        const filterWard = wardList.filter((i) => i.ward_id === wardid)
        const nameWard = Object.assign({}, ...filterWard)

        const empData = { id: generateRandomNumber(), name, phone, gender, selectProvince: nameProvice.province_name, selectDistrict: nameDistrict.district_name, selectWard: nameWard.ward_name, address, time: getTimeNow, card: cardToCheckOut, totalPrice: productTotalPriceInState, totalQuantity: productTotalQuantityInState }

        if (!isEmptyOrNil(empData)) {
            handleOrder(empData)
            // console.log(empData);
        } else {
            console.log('error to add new card');
        }
    }
    /* #endregion */

    const handleChangeGender = (e) => {
        setGender(e.target.value);
        // console.log(e.target.value);
    }

    return (
        <>
            <div className="container-customer-form">
                <form className="form_container" onSubmit={handleSubmit}>
                    <div className="card">
                        <div className="card-title">
                            <h2>Thông tin khách hàng</h2>
                        </div>
                        <div className="card-body">
                            <div className="form-check-gender">
                                <div onChange={handleChangeGender}>
                                    <input readOnly type="radio" value={EnumTypeGender.male} name="gender" checked={gender === EnumTypeGender.male} /> Anh
                                    <input readOnly type="radio" value={EnumTypeGender.female} name="gender" checked={gender === EnumTypeGender.female} /> Chị
                                </div>
                            </div>

                            <div className="form-input">

                                <div className="form-group">
                                    <input value={name} onMouseDown={e => setValidationChange(true)} onChange={e => setNameChange(e.target.value)} className="form-control" placeholder='Họ và Tên' />
                                </div>
                                {name.length === 0 && validation && <span className='text-warning'>Vui lòng nhập Họ và tên</span>}

                                {/* <div className="form-group">
                                    <label>Email</label>
                                    <input value={email} onChange={e => setEmailChange(e.target.value)} className="form-control" />
                                </div> */}

                                <div className="form-group">
                                    <input maxLength={10} value={phone} onChange={e => setPhoneChange(e.target.value)} className="form-control" placeholder='Số điện thoại' />
                                </div>
                                {phone.length === 0 && validation && <span className='text-warning'>Vui lòng nhập Số điện thoại</span>}
                            </div>

                            {/* <div className="form-check-status">
                                <input checked={active} onChange={e => setActiveChange(e.target.checked)} type='checkbox' className='form-check-input' />
                                <label className="form-check-label">Is Active</label>
                            </div> */}

                            <div className='form-chose-address'>
                                <h3>Chọn thông tin địa chỉ</h3>
                                <div className="form-input-location">
                                    <select name="country" className="form-control p-3" onChange={(e) => handlecountry(e)}>
                                        <option value="">Tỉnh thành</option>
                                        {
                                            provinceList?.map((i) => (
                                                <option key={i.province_id} value={i.province_id}>{i.province_name}</option>
                                            ))
                                        }
                                    </select>


                                    <select name="district" className="form-control p-3" onChange={(e) => handleDistrict(e)} >
                                        <option value="">Chọn Quận / Huyện</option>
                                        {
                                            districtList.map((i) => (
                                                <option key={i.district_id} value={i.district_id}>{i.district_name} </option>
                                            ))
                                        }
                                    </select>

                                    <select name="ward" className="form-control p-3" onChange={(e) => handleWard(e)}>
                                        <option value="">Chọn Phường / Xã</option>
                                        {
                                            wardList.map((i) => (
                                                <option key={i.ward_id} value={i.ward_id}>{i.ward_name} </option>
                                            ))
                                        }
                                    </select>

                                    <input value={address} onChange={e => setAddress(e.target.value)} className="form-control_inpAddress" placeholder='Số nhà, tên đường' />

                                </div>
                            </div>
                            <div className="form-group-button-submit">
                                <button type="submit" className="btn btn-success">Đặt hàng</button>
                            </div>
                        </div>
                    </div>
                </form>
                {/* <div style={{margin:'10px', padding:'10px', width:'50%'}}>
                    <SelectionList options={provinceList}
                        label="name"
                        id="id"
                        selectedVal={selectProvince}
                        handleChange={(val) => setSelectProvince(val)}
                    />
                    <SelectionList options={districtList}
                        label="name"
                        id="id"
                        selectedVal={selectDistrict}
                        handleChange={(val) => selectDistrict(val)}
                    />
                </div> */}
            </div>
        </>
    )
}

export default CustomerForm