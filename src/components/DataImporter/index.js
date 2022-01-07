import React, { useEffect } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import xlsx from 'xlsx'

function DataImporter() {
	const { color, text } = this.props
	
	const handleUpload = (file) => {
		const reader = new FileReader()
		reader.onload = e => {
				console.log(e)
				if (e.target) {
						const wb = xlsx.read(e.target.result, { type: 'binary' })
						wb.SheetNames.forEach(sheet => {
								const csv = xlsx.utils.sheet_to_json(wb.Sheets[sheet])
								setCellData(csv)
								setFileUploaded(true)
						})
				}
		}
		reader.readAsBinaryString(file)
}

	useEffect(() => {

	}, [])

	return (
		<View style={styles.wrapper}>
			<Text style={{ color }}>Not working on Native yet</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	wrapper: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	}
})

export default DataImporter
