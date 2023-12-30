const InputSearch = ({setSearchTerm, value}: any) => {
    return (
        <input type="text" placeholder="FIND NEW FRIENDS"
                            value={value}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex bg-opacity-50 bg-inherit border rounded-full h-[40px] w-[200px] pl-[34px] pr-[2rem] border-[#ffffff2e] text-[12px]" />
    )

}
export default InputSearch;