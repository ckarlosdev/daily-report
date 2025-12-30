type Props = {
  type: string;
  number: string;
  company: string;
  newHour: string;
  employees: string;
};

function Trow({type, number, company, newHour, employees}: Props) {
  return (
    <>
      <tr >
        <td>{type}</td>
        <td>{number}</td>
        <td>{company}</td>
        <td>{newHour}</td>
        <td>{employees}</td>
      </tr>
    </>
  );
}

export default Trow;
